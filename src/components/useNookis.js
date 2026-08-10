import { useEffect, useState } from 'react';

export default function useNookis() {
  const [nookis, setNookis] = useState([]);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    fetch('/nookis.json').then((response) => {
      if (!response.ok) throw new Error('Could not load the forest');
      return response.json();
    }).then(setNookis).finally(() => setLoading(false));
  }, []);
  return { nookis, loading };
}
