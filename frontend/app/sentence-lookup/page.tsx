'use client';

import SentenceLookup from '../../src/components/SentenceLookup';

export default function SentenceLookupPage() {
  const handleSearch = (filters: any) => {
    console.log('Search requested:', filters);
  };

  return <SentenceLookup onSearch={handleSearch} />;
}