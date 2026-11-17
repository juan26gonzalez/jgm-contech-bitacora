import {
  BarChart3,
  Boxes,
  CalendarDays,
  Compass,
  FileText,
  FlaskConical,
  ShieldCheck,
  Truck,
} from 'lucide-react';

export function getBitacoraNavGroups({ isEn, isDemo, totalRegistros }) {
  return [
    {
      id: 'ops',
      title: isEn ? '1. Field Ops' : '1. Operación',
      items: [
        {
          key: 'bitacora',
          icon: FileText,
          label: isEn ? 'Daily Field Log' : 'Bitácora Diaria',
          badge: String(totalRegistros ?? 0),
        },
        {
          key: 'cantidades',
          icon: BarChart3,
          label: isEn ? 'Contract Qty' : 'Cantidades Obra',
          badge: null,
        },
      ],
    },
    {
      id: 'eng',
      title: isEn ? '2. Engineering & 4D' : '2. Ingeniería & 4D',
      items: [
        {
          key: 'cronograma',
          icon: CalendarDays,
          label: isEn ? '4D Schedule' : 'Cronograma 4D',
          badge: null,
        },
        {
          key: 'planos',
          icon: Compass,
          label: isEn ? 'Drawings & IFC' : 'Planos & IFC',
          badge: isDemo ? '3' : '7',
        },
      ],
    },
    {
      id: 'qa',
      title: isEn ? '3. QA & Logistics' : '3. Calidad & Logística',
      items: [
        {
          key: 'calidad',
          icon: FlaskConical,
          label: isEn ? 'Concrete QA' : 'Calidad & Cilindros',
          badge: null,
        },
        {
          key: 'mixers',
          icon: Truck,
          label: isEn ? 'Ready-Mix' : 'Mixers & Remis.',
          badge: null,
        },
        {
          key: 'almacen',
          icon: Boxes,
          label: isEn ? 'Warehouse' : 'Almacén & Pañol',
          badge: null,
        },
      ],
    },
    {
      id: 'hse',
      title: isEn ? '4. Safety HSE' : '4. Seguridad HSEQ',
      items: [
        {
          key: 'sst',
          icon: ShieldCheck,
          label: isEn ? 'Safety & HSE' : 'Seguridad & SST',
          badge: null,
        },
      ],
    },
  ];
}

export function findBitacoraActiveMeta({ isEn, isDemo, totalRegistros, activeTab }) {
  const groups = getBitacoraNavGroups({ isEn, isDemo, totalRegistros });
  for (const grp of groups) {
    const found = grp.items.find((item) => item.key === activeTab);
    if (found) {
      return { groupTitle: grp.title, item: found };
    }
  }
  return { groupTitle: groups[0].title, item: groups[0].items[0] };
}
