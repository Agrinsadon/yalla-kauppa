export interface Store {
  id: string;
  name: string;
  address: string;
  postalCode: string;
  city: string;
  openingHours: {
    weekdays: string;
    weekends: string;
  };
}

export const stores: Store[] = [
  {
    id: 'malmi',
    name: 'Yalla Malmi',
    address: 'Hietakummuntie 19',
    postalCode: '00700',
    city: 'Helsinki',
    openingHours: {
      weekdays: 'Ma-Pe 9:00-20:00',
      weekends: 'La-Su 10:00-19:00',
    },
  },
  {
    id: 'myyrmaki',
    name: 'Yalla Myyrmäki',
    address: 'Liesitori 1',
    postalCode: '01600',
    city: 'Vantaa',
    openingHours: {
      weekdays: 'Ma-Pe 9:00-20:00',
      weekends: 'La-Su 10:00-19:00',
    },
  },
  {
    id: 'koivukyla',
    name: 'Yalla Koivukylä',
    address: 'Hakopolku 2',
    postalCode: '01360',
    city: 'Vantaa',
    openingHours: {
      weekdays: 'Ma-Pe 9:00-20:00',
      weekends: 'La-Su 10:00-19:00',
    },
  },
  {
    id: 'tikkurila',
    name: 'Yalla Tikkurila',
    address: 'Peltolantie 5',
    postalCode: '01300',
    city: 'Vantaa',
    openingHours: {
      weekdays: 'Ma-Pe 9:00-20:00',
      weekends: 'La-Su 10:00-19:00',
    },
  },
  {
    id: 'vuosaari',
    name: 'Yalla Vuosaari',
    address: 'Vuotie 45',
    postalCode: '00980',
    city: 'Helsinki',
    openingHours: {
      weekdays: 'Ma-Pe 9:00-20:00',
      weekends: 'La-Su 10:00-19:00',
    },
  },
];

