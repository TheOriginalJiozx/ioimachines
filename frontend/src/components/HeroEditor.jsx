import PropTypes from "prop-types";
import { useState } from "react";


export default function HeroEditor({ hero, adminToken, onSave, hideTitleInput }) {
  const [editHero, setEditHero] = useState(false);
  const [heroDraft, setHeroDraft] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  return (
    <div className="w-full h-80 sm:h-96 md:h-[34rem] bg-gray-100 overflow-hidden relative">
      {!editHero && hero.imageUrl && (
        <img src={hero.imageUrl} alt="hero" className="object-cover w-full h-full" />
      )}
      {editHero && heroDraft.imageUrl && (
        <img src={heroDraft.imageUrl} alt="hero" className="object-cover w-full h-full" />
      )}
      <label htmlFor="hero-image-url-initial" className="block mb-2 font-semibold">Image URL</label>
      <input
        id="hero-image-url-initial"
        value={heroDraft?.imageUrl ?? ""}
        onChange={e => setHeroDraft(prev => ({ ...prev, imageUrl: e.target.value }))}
        className="w-full border rounded p-2 mb-2"
        placeholder="Image URL"
      />
      {adminToken && !editHero && (
        <button
          className="absolute top-10 right-4 bg-white text-[#444444] border border-[#444444] px-4 py-2 rounded font-semibold shadow z-20"
          style={{ zIndex: 4 }}
          onClick={() => {
            setHeroDraft({
              title: hero.title || "",
              imageUrl: hero.imageUrl || "",
            });
            setImageFile(null);
            setEditHero(true);
          }}>
          Edit hero
        </button>
      )}
      {editHero && (
        <div className="absolute inset-0 bg-black/40 flex flex-col items-center justify-center z-30">
          <div className="bg-white rounded-lg p-6 shadow max-w-md w-full">
            <div className="flex flex-row gap-2 mb-2 items-center">
              <label htmlFor="hero-image-upload" className="m-0">
                <span className="bg-indigo-600 text-white px-4 py-2 rounded cursor-pointer inline-block">
                  Upload image
                </span>
              </label>
              <input
                id="hero-image-upload"
                type="file"
                accept="image/*"
                style={{ display: "none" }}
                onChange={(e) => {
                  const file = e.target.files && e.target.files[0];
                  if (!file) return;
                  setImageFile(file);
                  setHeroDraft((prev) => ({ ...prev, imageUrl: URL.createObjectURL(file) }));
                }}
              />
            </div>
            <label htmlFor="hero-image-url-modal" className="block mb-2 font-semibold">Or enter image URL</label>
            <input
              id="hero-image-url-modal"
              type="text"
              className="w-full border rounded p-2 mb-2"
              value={heroDraft.imageUrl}
              onChange={(e) => setHeroDraft((prev) => ({ ...prev, imageUrl: e.target.value }))}
              placeholder="Image URL"
            />
            {!hideTitleInput && (
              <>
                <label htmlFor="hero-title-modal" className="block mb-2 font-semibold">Title</label>
                <input
                  id="hero-title-modal"
                  type="text"
                  className="w-full border rounded p-2 mb-2"
                  value={heroDraft.title}
                  onChange={(e) => setHeroDraft((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="Hero title"
                />
              </>
            )}
            <div className="flex gap-2 mt-4">
              <button
                className="bg-indigo-600 text-white px-4 py-2 rounded"
                onClick={async () => {
                  let finalHero = { ...heroDraft };
                  if (imageFile) {
                    const formData = new FormData();
                    formData.append("file", imageFile);
                    try {
                      const API_BASE =
                        import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
                      const res = await fetch(`${API_BASE}/uploads`, {
                        method: "POST",
                        body: formData,
                        headers: {
                          ...(adminToken ? { Authorization: "Bearer " + adminToken } : {}),
                        },
                      });
                      if (res.ok) {
                        const data = await res.json();
                        if (data && data.url) {
                          finalHero.imageUrl = data.url;
                        }
                      }
                    } catch (error) {
                      console.error("Error uploading image", error);
                    }
                  }
                  await onSave(finalHero);
                  setEditHero(false);
                }}>
                Save
              </button>
              <button
                className="bg-[#444444] text-white px-4 py-2 rounded"
                onClick={() => setEditHero(false)}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="absolute inset-0 flex items-center">
        <div className="max-w-6xl mx-auto px-6 w-full flex items-center">
          <div className="lg:pl-0 -mt-80">
            <h1
              className="lg:text-[48px] text-3xl font-extrabold text-white uppercase"
              style={{ filter: "drop-shadow(0 8px 8px rgba(0,0,0,0.50))" }}>
              {editHero ? heroDraft.title : hero.title}
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}

HeroEditor.propTypes = {
  hero: PropTypes.shape({
    title: PropTypes.string,
    imageUrl: PropTypes.string,
  }),
  adminToken: PropTypes.string,
  onSave: PropTypes.func,
  hideTitleInput: PropTypes.bool,
};