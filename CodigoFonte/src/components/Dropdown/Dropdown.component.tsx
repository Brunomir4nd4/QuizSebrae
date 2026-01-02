'use client'
import { FunctionComponent } from 'react'
import type { Props } from './Dropdown.interface';
import React from 'react';
import { Menu } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'

/**
 * **Dropdown**
 *
 * ### 🧩 Funcionalidade
 * - Exibe lista suspensa de anos para seleção.
 * - Permite escolher um ano, disparando ação ao selecionar.
 * - Flexível para contextos que necessitam seleção de ano.
 * - Utiliza Headless UI Menu para acessibilidade.
 *
 * ### 💡 Exemplo de uso
 * ```tsx
 * <Dropdown
 *   startItem="Selecione o ano"
 *   onClick={(year) => console.log(year)}
 *   years={[2020, 2021, 2022]}
 * />
 * ```
 *
 * ### 🎨 Estilização
 * - Estilização com Tailwind CSS para aparência moderna.
 * - Menu com transições suaves (data-closed:scale-95, etc.).
 * - Hover effects nos itens para melhor UX.
 * - Ícone ChevronDown do Heroicons.
 *
 * @component
 */
export const Dropdown: FunctionComponent<Props> = ({
    startItem,
    onClick,
    years 
}) => {
    return (
        <Menu as="div" className="relative inline-block text-left">
            <div>
            <Menu.Button className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 ring-1 shadow-xs ring-gray-300 ring-inset hover:bg-gray-50">
                {startItem}
                <ChevronDownIcon aria-hidden="true" className="-mr-1 size-5 text-gray-400" />
            </Menu.Button>
            </div>
    
            <Menu.Items
            className="absolute right-0 z-10 mt-2 w-full origin-top-right rounded-md bg-white ring-1 shadow-lg ring-black/5 transition focus:outline-hidden data-closed:scale-95 data-closed:transform data-closed:opacity-0 data-enter:duration-100 data-enter:ease-out data-leave:duration-75 data-leave:ease-in"
            >
            <div className="py-1">
                {years.map((year, index) => (
                    <Menu.Item key={index}>
                        {({ active }) => (
                            <button
                                onClick={() => onClick(year)}
                                className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100 text-gray-900' : 'text-gray-700'}`}
                            >
                                {year}
                            </button>
                        )}
                    </Menu.Item>
                ))}
            </div>
            </Menu.Items>
        </Menu>
        )
};