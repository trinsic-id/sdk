export interface UserAgents {
  isMobile: boolean;
  isDesktop: boolean;
  isAndroid: boolean;
  isIos: boolean;
  isSSR: boolean;
}
export const detectUserAgents = (): UserAgents => {
  const userAgent = navigator.userAgent;
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera Mini/i));
  const isWindows = (): boolean => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i));

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindows());
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
  return {
    isMobile: isMobile(),
    isDesktop: isDesktop(),
    isAndroid: isAndroid(),
    isIos: isIos(),
    isSSR: isSSR(),
  };
};
