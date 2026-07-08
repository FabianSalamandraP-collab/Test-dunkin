"use client";

// Importaciones necesarias
import { Coffee, Instagram, Facebook, Twitter } from "lucide-react";

const Footer = () => {
  return (
    // Contenedor principal del footer
    <footer className="bg-neutral-950 text-neutral-300">
      <div className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-4">
          {/* Sección del logo y descripción */}
          <div className="md:col-span-2">
            <div className="mb-6 flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-gradient-to-br from-primary-400 to-primary-600">
                <Coffee className="text-white h-6 w-6" />
              </div>
              <span className="text-white text-xl font-bold">
                Dunkin Colombia
              </span>
            </div>
            <p className="max-w-md leading-relaxed text-neutral-400">
              Descubre qué dice tu bebida favorita sobre tu personalidad con la
              campaña oficial de Dunkin Colombia.
            </p>
          </div>

          {/* Sección de enlaces */}
          <div>
            <h4 className="text-white mb-5 text-lg font-semibold">Enlaces</h4>
            <ul className="space-y-3">
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Inicio
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-white transition-colors">
                  Contacto
                </a>
              </li>
            </ul>
          </div>

          {/* Sección de redes sociales */}
          <div>
            <h4 className="text-white mb-5 text-lg font-semibold">Síguenos</h4>
            <div className="flex gap-4">
              {[Instagram, Facebook, Twitter].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-10 w-10 items-center justify-center rounded-2xl bg-neutral-800 transition-colors hover:bg-neutral-700"
                >
                  <Icon className="h-5 w-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Sección de derechos reservados */}
        <div className="mt-12 border-t border-neutral-800 pt-8 text-center text-sm text-neutral-500">
          <p>© 2024 Dunkin Colombia. Todos los derechos reservados.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
