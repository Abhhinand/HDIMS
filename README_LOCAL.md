# HDIMS enhanced website

This folder is a separate copy of the supplied HDIMS full-stack project. It does not change the PAIMANA Sentinel workspace.

## Open the website

The local preview is running at http://127.0.0.1:5174/ on this computer.

To start it later:

```powershell
cd C:\Users\Niranjan\Downloads\HDIMS_Enhanced_Website\frontend
npm ci
npm run dev -- --port 5174
```

Build check:

```powershell
npm run build
```

## What is included

- Responsive care dashboard based on the supplied UI reference, with HDIMS-specific content.
- Counts, risk tiers, chart segments, and watchlist calculated from the sample patients' NEWS2 scores.
- Priority and care-card buttons that filter and scroll to the watchlist.
- Existing patient, access, audit, consent, and escalation demo screens.
- Care timeline for manually entered test results, report attachments, clinician review dates, medicine duration and observed side effects. Entries remain in memory while navigating the demo and disappear on refresh.
- Printable handoff summary for the selected patient. Download any attached report separately before leaving the session.
- Supplied pitch deck and project abstract copied into `frontend/public`.

See [PRODUCT_ROADMAP.md](PRODUCT_ROADMAP.md) for the competitor comparison, proposed differentiation, and next feature priorities.

This is an interactive demo using sample data. The frontend does not yet connect its patient state to the FastAPI backend, bedside monitors, or a production ABDM gateway. It should not be used to make clinical decisions or exposed publicly as a live hospital system without integration, authentication, and security review.
