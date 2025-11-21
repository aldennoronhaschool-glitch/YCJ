export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto text-center">
        <p className="text-gray-600 text-sm">
          © {currentYear} Youth of Christha Jyothi - CSI Christha Jyothi Church. All rights reserved.
        </p>
      </div>
    </footer>
  );
}

