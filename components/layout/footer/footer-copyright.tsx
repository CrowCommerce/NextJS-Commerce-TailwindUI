'use client';

const { COMPANY_NAME } = process.env;

export default function FooterCopyright() {
  const currentYear = new Date().getFullYear();
  
  return (
    <p className="text-sm text-gray-500">
      &copy; {currentYear} {COMPANY_NAME} All rights reserved.
    </p>
  );
}

