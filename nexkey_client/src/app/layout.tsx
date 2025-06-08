import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "DID Management System",
  description: "A decentralized identity management system for organizations and users",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <main className="min-h-screen">
          {children}
        </main>
        <footer className="bg-[#1a365d] text-white py-8">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4">Contact Us</h3>
                <p className="text-sm text-gray-300">Email: support@didsystem.gov</p>
                <p className="text-sm text-gray-300">Phone: (555) 123-4567</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li><a href="/privacy" className="hover:text-white">Privacy Policy</a></li>
                  <li><a href="/terms" className="hover:text-white">Terms of Service</a></li>
                  <li><a href="/faq" className="hover:text-white">FAQ</a></li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-4">Office Hours</h3>
                <p className="text-sm text-gray-300">Monday - Friday: 9:00 AM - 5:00 PM</p>
                <p className="text-sm text-gray-300">Closed on Public Holidays</p>
              </div>
            </div>
            <div className="mt-8 pt-8 border-t border-gray-700 text-center text-sm text-gray-300">
              © 2024 Government DID Management System. All rights reserved.
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
