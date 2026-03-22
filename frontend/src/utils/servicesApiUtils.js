// API and data helpers for Services page

export async function fetchHero(setHero, adminToken) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const res = await fetch(`${API_BASE}/page-heros/services`, {
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
      },
    });
    if (res.ok) {
      const data = await res.json();
      setHero(data);
    }
  } catch (e) {
    console.error("Failed to fetch hero data", e);
  }
}

export async function fetchSection(setters, adminToken) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const res = await fetch(`${API_BASE}/sections/services-maintenance-ownership`, {
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
      },
    });
    const json = res && res.ok ? await res.json() : null;
    if (json && json.content) {
      const parsed = JSON.parse(json.content);
      if (setters.setMaintenanceTitle) setters.setMaintenanceTitle(parsed.maintenanceTitle || "");
      if (setters.setMaintenanceBody) setters.setMaintenanceBody(parsed.maintenanceBody || "");
      if (setters.setMaintenanceList) setters.setMaintenanceList(parsed.maintenanceList || []);
      if (setters.setMaintenanceFooter) setters.setMaintenanceFooter(parsed.maintenanceFooter || "");
      if (setters.setOwnershipTitle) setters.setOwnershipTitle(parsed.ownershipTitle || "");
      if (setters.setOwnershipBody) setters.setOwnershipBody(parsed.ownershipBody || "");
      if (setters.setOwnershipListTitle) setters.setOwnershipListTitle(parsed.ownershipListTitle || "");
      if (setters.setOwnershipList) setters.setOwnershipList(parsed.ownershipList || []);
      if (setters.setOwnershipFooter) setters.setOwnershipFooter(parsed.ownershipFooter || "");
    }
    return json;
  } catch (e) {
    console.error("Failed to fetch section data", e);
  }
}

export async function fetchModalTexts(setModalTexts, adminToken) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const res = await fetch(`${API_BASE}/modals/services`, {
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
      },
    });
    const json = res && res.ok ? await res.json() : null;
    setModalTexts(json);
  } catch (e) {
    console.error("Failed to fetch modal texts", e);
  }
}

export async function fetchSiteSectionAndCards(setters, adminToken) {
  try {
    const API_BASE = import.meta.env.VITE_API_BASE || import.meta.env.VITE_API_BASE_ONLINE;
    const resVision = await fetch(`${API_BASE}/sections/services-vision`, {
      headers: {
        'Content-Type': 'application/json',
        ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
      },
    });
    const jsonVision = resVision && resVision.ok ? await resVision.json() : null;
    if (jsonVision && jsonVision.content) {
      const parsed = JSON.parse(jsonVision.content);
      setters.setSiteSectionTitle(parsed.title || "");
      setters.setSiteSectionSubtitle(parsed.subtitle || "");
      setters.setSiteSectionBody1(parsed.body1 || "");
      setters.setSiteSectionBody2(parsed.body2 || []);
    }

    try {
      const resCards = await fetch(`${API_BASE}/sections/services-cards`, {
        headers: {
          'Content-Type': 'application/json',
          ...(adminToken ? { Authorization: 'Bearer ' + adminToken } : {}),
        },
      });
      const jsonCards = resCards && resCards.ok ? await resCards.json() : null;
      if (jsonCards && jsonCards.content) {
        const parsed = JSON.parse(jsonCards.content);
        if (parsed.card1) {
          setters.setCard1Title(parsed.card1.title || "");
          setters.setCard1Text(parsed.card1.text || "");
          setters.setCard1Icon(parsed.card1.icon || "");
        }
        if (parsed.card2) {
          setters.setCard2Title(parsed.card2.title || "");
          setters.setCard2Text(parsed.card2.text || "");
          setters.setCard2Icon(parsed.card2.icon || "");
        }
        if (parsed.card3) {
          setters.setCard3Title(parsed.card3.title || "");
          setters.setCard3Text(parsed.card3.text || "");
          setters.setCard3Icon(parsed.card3.icon || "");
        }
      }
    } catch (e) {
      console.error("Failed to fetch cards data", e);
    }
  } catch (e) {
    console.error("Failed to fetch vision section data", e);
  }
}
