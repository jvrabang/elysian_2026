# BSA Batch 2026 CPALE Review Donation Campaign

This is a simple static website for a donation campaign supporting BSA Batch 2026 graduates preparing for the CPA Licensure Examination (CPALE). The site is ready for GitHub Pages and uses plain HTML, CSS, and JavaScript only.

## What this website is for

- Explains the campaign purpose and funding goals.
- Introduces the applicants who may receive support.
- Guides donors step by step through payment, confirmation, and next steps.
- Shares the transparency process, contacts, and FAQs.

## How the step-by-step donation flow works

1. **Campaign page (`index.html`)**
   - Read campaign details, goals, coverage, and applicant profiles.
   - Press the button to proceed to payment methods.
2. **Payment page (`payment.html`)**
   - Choose a payment method.
   - Scan the corresponding QR code.
   - Save proof of payment.
   - Proceed to the confirmation page.
3. **Confirmation page (`confirmation.html`)**
   - Review the details needed for confirmation.
   - Use the confirmation form link or QR code to submit proof.
   - Continue to next steps.
4. **Next steps page (`next-steps.html`)**
   - Learn how donations are monitored.
   - Find contact cards and FAQs.

## How to update QR code images

- Replace the placeholder image files in the `assets/` folder:
  - `assets/payment-qr-maya.png`
  - `assets/payment-qr-bpi.png`
  - `assets/payment-qr-unionbank.png`
  - `assets/payment-qr-maribank.png`
  - `assets/payment-qr-gotyme.png`
  - `assets/confirmation-qr.png`
- Keep the filenames the same so the page paths remain valid.

## How to update the confirmation form link

- Open `confirmation.html`.
- Find the button with `href="#"` and replace the placeholder link with the actual confirmation form URL.

## How to update Messenger links

- Open `next-steps.html`.
- Find the contact card buttons with `href="#"`.
- Replace each placeholder `href` with the corresponding Messenger profile link.

## How to update the Google Sheets tracker link

- Open `next-steps.html`.
- Find the `View Public Donation Tracker` button.
- Replace the placeholder `href="#"` with the actual Google Sheets tracker URL.

## How to update the donation deadline

- Update the deadline text in the page content if needed.
- The deadline appears on `index.html`, `payment.html`, and `next-steps.html`.

## How to publish through GitHub Pages

1. Create a GitHub repository for this site.
2. Upload all files in this folder.
3. Go to the repository Settings.
4. Go to the Pages section.
5. Set the source to the `main` branch and the root folder.
6. Save and wait for the GitHub Pages link to become available.

## Files included

- `index.html`
- `payment.html`
- `confirmation.html`
- `next-steps.html`
- `styles.css`
- `script.js`
- `README.md`
- `assets/` (placeholder QR image paths)
