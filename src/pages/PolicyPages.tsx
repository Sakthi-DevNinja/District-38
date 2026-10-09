import React from 'react';
import { useShop } from '../context/ShopContext';
import { usePageMeta } from '../hooks/use-page-meta';
import { POLICY, businessName } from '../data/policies';

// Legal / policy pages. Every business-specific value comes from
// data/policies.ts, so nothing here promises more than the owner confirmed.

interface PolicyLayoutProps {
  title: string;
  intro: React.ReactNode;
  children: React.ReactNode;
}

const PolicyLayout: React.FC<PolicyLayoutProps> = ({ title, intro, children }) => (
  <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6 text-sm text-neutral-700 leading-relaxed">
    <header className="space-y-2 border-b border-neutral-200 pb-5">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-neutral-950">{title}</h1>
      <p className="text-xs text-neutral-500">Last updated: {POLICY.lastUpdated}</p>
      <p>{intro}</p>
    </header>
    {children}
  </article>
);

const Section: React.FC<{ title: string; children: React.ReactNode }> = ({ title, children }) => (
  <section className="space-y-2">
    <h2 className="text-base sm:text-lg font-bold text-neutral-950 pt-2">{title}</h2>
    {children}
  </section>
);

const List: React.FC<{ items: React.ReactNode[] }> = ({ items }) => (
  <ul className="list-disc pl-5 space-y-1.5">
    {items.map((item, i) => <li key={i}>{item}</li>)}
  </ul>
);

const ContactBlock: React.FC = () => (
  <address className="not-italic rounded-xl border border-neutral-200 bg-neutral-50 p-4 space-y-1">
    <div className="font-semibold text-neutral-900">{businessName()}</div>
    <div>{POLICY.address}</div>
    <div>Phone / WhatsApp: {POLICY.phone}</div>
    <div>Email: <a className="text-orange-700 hover:underline" href={`mailto:${POLICY.email}`}>{POLICY.email}</a></div>
    {POLICY.gstin && <div>GSTIN: {POLICY.gstin}</div>}
  </address>
);

const PolicyLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => {
  const { navigate } = useShop();
  return (
    <button onClick={() => navigate(to)} className="text-orange-700 font-semibold hover:underline">
      {children}
    </button>
  );
};

// ─── Shipping & Delivery ──────────────────────────────────────────────────────

export const ShippingPolicyPage: React.FC = () => {
  usePageMeta({
    title: 'Shipping & Delivery Policy',
    description: `Free shipping across India. In-stock orders dispatch in ${POLICY.dispatchDaysInStock} business days from ${POLICY.brandName}, Trichy.`,
    path: '/shipping'
  }, []);

  return (
    <PolicyLayout
      title="Shipping & Delivery Policy"
      intro={<>This policy explains how and when orders placed on this website are delivered by {businessName()}.</>}
    >
      <Section title="1. Where we deliver">
        <p>We deliver to addresses across India that our courier partners serve. If a pincode cannot be served, we will contact you before dispatch and, if you prefer, cancel the order with a full refund.</p>
      </Section>

      <Section title="2. Shipping charges">
        <p>Shipping is <strong>free</strong> on all orders. The total shown at checkout is the total you pay.</p>
      </Section>

      <Section title="3. Dispatch time">
        <List items={[
          <>Orders are reviewed by our team after payment. <strong>In-stock items</strong> are packed and handed to the courier within <strong>{POLICY.dispatchDaysInStock} business days</strong>.</>,
          <>Items marked <strong>"Available on order"</strong> on the product page are not in our store yet. They are dispatched once they arrive; the expected time is shown on the product page and at checkout.</>,
          <>If one item in your order is on order, we may ship the available items first or ship everything together. We will tell you which.</>,
          <>Orders are not dispatched on Sundays and public holidays.</>
        ]} />
      </Section>

      <Section title="4. Delivery time">
        <p>After dispatch, delivery usually takes <strong>{POLICY.deliveryDays} business days</strong> depending on your location. Remote areas can take longer. Courier delays caused by weather, strikes or other events outside our control are not in our hands, but we will help you follow up.</p>
      </Section>

      <Section title="5. Tracking">
        <p>When your order is dispatched we share the courier name and tracking number with you by email or WhatsApp. You can also see your order status under <PolicyLink to="/account/orders">My Orders</PolicyLink>.</p>
      </Section>

      <Section title="6. Receiving your parcel">
        <List items={[
          'Please give a correct address, pincode and a mobile number the courier can reach. We are not responsible for delays caused by incorrect details.',
          `Check that the outer package is sealed and undamaged. Record a short unboxing video, and report any damage, missing or wrong item within ${POLICY.damageReportHours} hours of delivery (see our Returns, Refunds & Cancellation policy).`,
          'If a parcel comes back to us because the address was wrong or nobody accepted it, we will contact you to arrange re-delivery or a refund. Re-delivery charges, if any, are told to you first.'
        ]} />
      </Section>

      <Section title="7. Contact">
        <ContactBlock />
      </Section>
    </PolicyLayout>
  );
};

// ─── Returns, Refunds & Cancellation ──────────────────────────────────────────

export const ReturnsPolicyPage: React.FC = () => {
  usePageMeta({
    title: 'Returns, Refunds & Cancellation Policy',
    description: `Cancellation before dispatch, damaged or wrong items, and how refunds work at ${POLICY.brandName}.`,
    path: '/returns'
  }, []);

  return (
    <PolicyLayout
      title="Returns, Refunds & Cancellation Policy"
      intro={<>This policy covers cancelling an order, problems with a delivered item, and how refunds are paid for orders placed on this website with {businessName()}.</>}
    >
      <Section title="1. Cancelling an order">
        <List items={[
          <>You can cancel an order <strong>before it is dispatched</strong>. Contact us on WhatsApp or email with your order number. You get a <strong>full refund</strong>.</>,
          'Once an order has been dispatched it cannot be cancelled. If something is wrong with it after delivery, section 2 applies.',
          'We may cancel an order ourselves, for example if an item is no longer available, the price shown was clearly wrong, or the address cannot be served. You then get a full refund, and we tell you why.'
        ]} />
      </Section>

      <Section title="2. Damaged, defective or wrong items">
        <List items={[
          <>Report the problem within <strong>{POLICY.damageReportHours} hours of delivery</strong> on WhatsApp or email, with your order number, photos, and the unboxing video if you have one.</>,
          'Keep the item unused, with all tags, accessories, visor films and the original box.',
          'After we check the item, we replace it, or refund you in full if a replacement is not available. We arrange the pickup or tell you where to send it, at no cost to you.'
        ]} />
      </Section>

      {POLICY.sizeExchangeDays !== null && (
        <Section title="3. Size exchange">
          <p>If a helmet, jacket, glove or boot does not fit, you can ask for a different size of the same product within <strong>{POLICY.sizeExchangeDays} days of delivery</strong>, subject to stock.</p>
          <List items={[
            'The item must be unused and unworn, with all tags, visor films, paperwork and the original box undamaged.',
            'Helmets that have been worn while riding, and items that show use, cannot be exchanged, for hygiene and safety reasons.',
            'Contact us first with your order number and the size you need; we confirm availability and how to send the item back.'
          ]} />
        </Section>
      )}

      <Section title={`${POLICY.sizeExchangeDays !== null ? 4 : 3}. Items we cannot take back`}>
        <p>Apart from the cases above, we do not accept returns for change of mind. This includes items bought on sale, consumables such as cleaners, lubes and sprays once opened, and products that have been used or fitted to a motorcycle.</p>
      </Section>

      <Section title={`${POLICY.sizeExchangeDays !== null ? 5 : 4}. How refunds are paid`}>
        <List items={[
          <>Refunds go back to the <strong>original payment method</strong> (UPI, card, net banking or wallet) through our payment partner Razorpay.</>,
          <>We issue the refund within 2 business days of approving it. Your bank or card issuer usually shows it within <strong>{POLICY.refundDays} business days</strong> after that.</>,
          'We do not charge any fee for refunds.'
        ]} />
      </Section>

      <Section title={`${POLICY.sizeExchangeDays !== null ? 6 : 5}. Contact`}>
        <ContactBlock />
      </Section>
    </PolicyLayout>
  );
};

// ─── Privacy ──────────────────────────────────────────────────────────────────

export const PrivacyPolicyPage: React.FC = () => {
  usePageMeta({
    title: 'Privacy Policy',
    description: `What personal information ${POLICY.brandName} collects, why, who it is shared with, and your rights.`,
    path: '/privacy'
  }, []);

  return (
    <PolicyLayout
      title="Privacy Policy"
      intro={<>{businessName()} ("we", "us") runs this website. This policy explains what personal information we collect when you use it, why, and the choices you have. It follows India's Digital Personal Data Protection Act, 2023 and the Information Technology Act, 2000.</>}
    >
      <Section title="1. What we collect">
        <List items={[
          <><strong>Account details:</strong> your name, email address and password (stored only in encrypted, hashed form).</>,
          <><strong>Order details:</strong> the delivery name, mobile number and address you enter, the items you order, and your order history.</>,
          <><strong>Payment details:</strong> payments are handled by Razorpay. Your card, UPI or bank details go directly to Razorpay; we never see or store them. We only receive the payment status and a reference number.</>,
          <><strong>Messages:</strong> anything you send us through the contact form, email or WhatsApp.</>,
          <><strong>Technical data:</strong> our servers keep basic logs (such as IP address and browser type) for security and to fix problems.</>
        ]} />
      </Section>

      <Section title="2. Why we use it">
        <List items={[
          'To take, process and deliver your orders, including sharing your name, phone and address with the courier.',
          'To send you messages about your order (confirmation, dispatch, delivery, refunds).',
          'To answer your questions and handle warranty, exchange and refund requests.',
          'To keep the website secure and prevent fraud.',
          'To meet legal duties such as tax and accounting records.'
        ]} />
        <p>We do not send marketing messages unless you ask us to, and you can stop them at any time.</p>
      </Section>

      <Section title="3. Who we share it with">
        <p>We do not sell or rent your personal information. We share it only with the service providers we need to run the shop, and only what they need:</p>
        <List items={[
          'Razorpay, to process payments.',
          'Courier companies, to deliver your order.',
          'Our hosting and email providers, who store data and send order emails for us.',
          'Government authorities, when the law requires it.'
        ]} />
      </Section>

      <Section title="4. Cookies and browser storage">
        <p>We do not use advertising or tracking cookies. The website stores a few items in your own browser so it works properly: your sign-in, your cart before you sign in, and your recently viewed products and searches. You can clear them at any time from your browser settings.</p>
      </Section>

      <Section title="5. How long we keep it">
        <p>We keep your account while it is open. Order and invoice records are kept for as long as tax and accounting laws require (usually 8 years). Other data is deleted when it is no longer needed.</p>
      </Section>

      <Section title="6. Your rights">
        <p>You can ask us to show you the personal information we hold about you, correct it, or delete your account (except records we must keep by law). You can also withdraw consent you have given. Write to us at <a className="text-orange-700 hover:underline" href={`mailto:${POLICY.email}`}>{POLICY.email}</a>; we reply within 30 days.</p>
      </Section>

      <Section title="7. Security">
        <p>Your data is sent over encrypted (HTTPS) connections, passwords are stored hashed, and access to customer data is limited to staff who need it. No system is perfectly secure, but we take reasonable care to protect your information.</p>
      </Section>

      <Section title="8. Grievance officer">
        <p>
          {POLICY.grievanceOfficer
            ? <>For any concern about your personal information, contact our grievance officer, <strong>{POLICY.grievanceOfficer}</strong>, using the details below.</>
            : <>For any concern about your personal information, contact us using the details below.</>}
        </p>
        <ContactBlock />
      </Section>

      <Section title="9. Changes to this policy">
        <p>We may update this policy. The date at the top shows the latest version.</p>
      </Section>
    </PolicyLayout>
  );
};

// ─── Terms & Conditions ───────────────────────────────────────────────────────

export const TermsPage: React.FC = () => {
  usePageMeta({
    title: 'Terms & Conditions',
    description: `The terms that apply when you shop on the ${POLICY.brandName} website.`,
    path: '/terms'
  }, []);

  return (
    <PolicyLayout
      title="Terms & Conditions"
      intro={<>These terms apply when you use this website or buy from {businessName()}, {POLICY.address}. By placing an order you agree to them.</>}
    >
      <Section title="1. Your account">
        <List items={[
          'You need an account to place an order. Please give correct details and keep your password private; you are responsible for orders placed from your account.',
          'You must be 18 or older, or use the website with a parent or guardian.'
        ]} />
      </Section>

      <Section title="2. Products and prices">
        <List items={[
          'We try to describe and photograph every product accurately. Colours can look slightly different on different screens.',
          'Prices are in Indian Rupees and include applicable taxes unless stated otherwise. Shipping is free.',
          'Prices and availability can change without notice. The price that applies is the one shown when you place the order.',
          'If a price or description is clearly wrong, we may cancel the order and refund you in full, even after you have paid.'
        ]} />
      </Section>

      <Section title="3. Orders">
        <List items={[
          'Your order is accepted when we confirm it after payment. We may decline or cancel an order, for example when stock runs out or an address cannot be served; you then get a full refund.',
          'Items marked "Available on order" are ordered from our suppliers for you and dispatched when they arrive, in the time shown on the product page.'
        ]} />
      </Section>

      <Section title="4. Payment">
        <p>Payments are processed securely by Razorpay (UPI, cards, net banking and wallets). We do not store your card or bank details.</p>
      </Section>

      <Section title="5. Delivery, cancellation and refunds">
        <p>
          Delivery is covered by our <PolicyLink to="/shipping">Shipping & Delivery Policy</PolicyLink>; cancellations, damaged items and refunds by our <PolicyLink to="/returns">Returns, Refunds & Cancellation Policy</PolicyLink>.
        </p>
      </Section>

      <Section title="6. Warranty">
        <p>Products carry the manufacturer's warranty where the manufacturer offers one, under the manufacturer's own terms. We help you raise warranty claims with the brand. Helmets and protective gear must be used and stored as the manufacturer instructs; a helmet that has taken an impact should be replaced.</p>
      </Section>

      <Section title="7. Use of the website">
        <p>Do not misuse the website, try to break its security, or copy its content for commercial use. Product names and logos belong to their brand owners.</p>
      </Section>

      <Section title="8. Liability">
        <p>To the extent the law allows, our liability for any order is limited to the amount you paid for it. Nothing in these terms limits your rights as a consumer under Indian law.</p>
      </Section>

      <Section title="9. Law and disputes">
        <p>These terms are governed by the laws of India. Please contact us first so we can try to solve any problem. Any dispute is subject to the courts of {POLICY.jurisdiction}.</p>
      </Section>

      <Section title="10. Contact">
        <ContactBlock />
      </Section>
    </PolicyLayout>
  );
};
