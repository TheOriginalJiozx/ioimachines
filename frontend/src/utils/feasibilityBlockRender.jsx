
import React from "react";
import PropTypes from "prop-types";

function RenderTitle({ title, hideTitle, as = "h3", className = "" }) {
  if (!title || hideTitle) return null;
  const Tag = as;
  return <Tag className={className}>{title}</Tag>;
}

RenderTitle.propTypes = {
  title: PropTypes.string,
  hideTitle: PropTypes.bool,
  as: PropTypes.string,
  className: PropTypes.string,
};

function RenderImages({ images }) {
  if (!images || images.length === 0) return null;
  return (
    <div className="mt-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
      {images.map((img, i) => (
        <img key={i} src={img} alt={`image-${i}`} className="w-full h-28 sm:h-32 md:h-40 object-contain bg-white p-2 rounded" />
      ))}
    </div>
  );
}

RenderImages.propTypes = {
  images: PropTypes.arrayOf(PropTypes.string),
};

function RenderList({ items, ordered, className = "", style = {} }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag style={style} className={className}>
      {items.map((item, i) => (
        <li key={i} className="mb-2">{item}</li>
      ))}
    </Tag>
  );
}

RenderList.propTypes = {
  items: PropTypes.array.isRequired,
  ordered: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export function feasibilityBlockRender(block, index) {
  if (!block) return null;
  const type = block.type;
  if (type === "paragraph") {
    const hideTitle = block.title && (block.title.toLowerCase().includes("image text") || block.title.toLowerCase().includes("images"));
    const isProcessBlock = block.title && block.title.toLowerCase() === "process";
    const hasSemicolons = block.text && block.text.includes(";");
    if (isProcessBlock && hasSemicolons) {
      const items = block.text.split(";").map(item => item.trim()).filter(item => item.length > 0);
      return (
        <div key={index} className="mb-4">
          <RenderTitle title={block.title} hideTitle={hideTitle} as="h2" className="text-[56px] font-semibold text-[#222222] mb-3" />
          <RenderList items={items} ordered={false} className="mt-4 space-y-2 text-[15px] text-[#444444]" style={{ listStyle: 'disc', marginLeft: '1.5rem' }} />
        </div>
      );
    }
    return (
      <div key={index} className="mb-4">
        <RenderTitle title={block.title} hideTitle={hideTitle} as="h3" className="text-[24px] font-semibold text-[#222222] mb-2" />
        <div className="whitespace-pre-wrap text-[15px] text-[#444444]">{block.text}</div>
        <RenderImages images={block.images} />
      </div>
    );
  }
  if (type === "image") {
    return (
      <div key={index} className="mb-4">
        <img src={block.src} alt={block.alt || ""} className="w-full rounded shadow" />
      </div>
    );
  }
  if (type === "list") {
    const hideTitle = block.title && block.title.toLowerCase() === "gui functions";
    const ordered = block.style === "decimal";
    const isScope = ordered;
    const displayItems = (block.items || []).map(item => {
      if (block.title && block.title.toLowerCase() === "process" && item && typeof item === 'string') {
        return item.replace(/;+$/, '').trim();
      }
      return item;
    });
    if (isScope) {
      return (
        <div key={index} className="mt-8 bg-[#FAFAFA] p-6 rounded shadow-sm">
          <h3 className="text-[20px] font-semibold mb-3 text-[#222222]">Scope & Approach</h3>
          <RenderList items={displayItems} ordered={true} className="list-decimal pl-8 space-y-2 text-[15px] text-[#444444]" />
        </div>
      );
    }
    return (
      <div key={index} className="mb-4">
        <RenderTitle title={block.title} hideTitle={hideTitle} as="h2" className={`${block.title === "Process" ? "text-[56px]" : "text-[40px]"} font-semibold text-[#222222] mb-3`} />
        {block.extraText && block.extraText.length > 0 && (
          <div className="mb-3 text-[15px] text-[#444444]">
            {block.extraText.map((text, i) => (
              <p key={i} className="mb-2">{text}</p>
            ))}
          </div>
        )}
        <RenderList
          items={displayItems}
          ordered={ordered}
          className="mt-4 space-y-2 text-[15px] text-[#444444]"
          style={ordered ? undefined : { listStyleType: 'disc', marginLeft: '1.5rem' }}
        />
      </div>
    );
  }
  return null;
}
