import { useEffect, useState } from 'react';

export function useWhitelist(isActiveWhitelist: boolean) {
  const [addressList, setAddressList] = useState<string[]>();

  const fetchWhitelist = async () => {
    const whitelistLink = process.env.REACT_APP_WHITELIST_LINK;

    if (!whitelistLink) {
      throw new Error('Whitelist link not defined');
    }

    const response = await fetch(whitelistLink);
    const jsonData = await response.json();
    return jsonData;
  };

  useEffect(() => {
    if (isActiveWhitelist) {
      fetchWhitelist()
        .then((whitelist) => {
          setAddressList(Object.keys(whitelist.claims));
        })
        .catch(console.error);
    }
  }, [isActiveWhitelist]);

  const checkIsWhitelisted = (address: string) => addressList?.length && addressList?.includes(address);

  return checkIsWhitelisted;
}
