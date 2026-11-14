export const patnaLocalities = [
  'Boring Road', 'Boring Canal Road', 'Kankarbagh', 'Rajendra Nagar', 'Patliputra Colony',
  'Bailey Road', 'Danapur', 'Khagaul', 'Phulwari Sharif', 'Anisabad', 'Ashok Rajpath',
  'Exhibition Road', 'Fraser Road', 'Gandhi Maidan', 'Kurji', 'Digha', 'Ashiana Nagar',
  'Ashiana-Digha Road', 'Saguna More', 'Rukanpura', 'Mithapur', 'Raja Bazar',
  'Sri Krishna Puri', 'Gardanibagh', 'Jakkanpur', 'Kidwaipuri', 'Hartali More', 'Beur',
  'Sampatchak', 'Patrakar Nagar', 'Shastri Nagar', 'Nageshwar Colony', 'Lohia Nagar',
  'Ram Krishna Nagar', 'Punaichak', 'Mahendru', 'Sultanganj', 'Gulzarbagh', 'Bankipore',
  'Kumhrar', 'Bypass', 'Parsa Bazar', 'Maner', 'Bihta', 'Fatuha', 'Didarganj', 'Rajiv Nagar',
  'Yarpur', 'Pirmuhani', 'Kadamkuan', 'Mushallahpur', 'Patna City', 'Buddha Colony',
  'Gola Road', 'Kankarbagh Colony', 'Boring Canal Road', 'Bailey Road', 'Nala Road',
  'Gulzarbagh', 'Agam Kuan', 'Chandmari Road', 'Bhootnath Road', 'Bahadurpur', 'Khemnichak',
  'Lohanipur', 'Kadamkuan', 'Lodipur', 'Dak Bungalow Road', 'New Patliputra Colony',
  'Anandpuri', 'Rajapur Pul', 'Raja Pul', 'North Mandiri', 'South Mandiri', 'Adalatganj',
  'Keshri Nagar', 'Indrapuri', 'Jagdeo Path', 'Rupaspur', 'Shivpuri', 'AG Colony',
  'RPS More', 'Saguna Khagaul Road', 'Nasriganj', 'Jaganpura', 'Ramjaipal Nagar', 'Sipara',
  'Chitkohra', 'Gardanibagh Housing Colony', 'Mithapur Bus Stand Area', 'Bairiya', 'Zero Mile',
  'Transport Nagar', 'New Bypass', 'Kankarbagh Main Road', 'Patel Nagar', 'Rajbansi Nagar',
  'Hanuman Nagar', 'Kumhrar Park Area', 'Ashok Nagar', 'Mithapur Farm Area'
] as const;

export function localitySlug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export const localityPages = Array.from(new Map(patnaLocalities.map((name) => [localitySlug(name), { name, slug: localitySlug(name) }])).values());
