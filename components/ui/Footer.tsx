"use client";

import { Coffee, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center">
                <Coffee className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">Dunkin Colombia</span>
            </div>
            <p className="text-neutral-400 max-w-md leading-relaxed">
              Descubre qué dice tu bebida favorita sobre tu personalidad con la campaña oficial de Dunkin Colombia.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Enlaces</h4>
            <ul className="space-y-3">
              <li><a href="#" className="hover:text-white transition-colors">Inicio</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Términos y condiciones</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política de privacidad</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Contacto</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold text-lg mb-5">Síguenos</h4>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="w-10 h-10 rounded-2xl bg-neutral-800 flex items-center justify-center hover:bg-neutral-700 transition-colors"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        <div className="border-t border-neutral-800 mt-12 pt-8 text-center text-neutral-500 text-sm">
          <p>© 2024 Dunkin Colombia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
