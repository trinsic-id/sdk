export interface UserAgents {
  isMobile: boolean;
  isDesktop: boolean;
  isAndroid: boolean;
  isMacOs: boolean;
  isIos: boolean;
  isChromium: boolean;
  isChrome: boolean;
  isSafari: boolean;
  isSSR: boolean;
}
export const detectUserAgents = (): UserAgents => {
  const userAgent = navigator.userAgent;
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
  const isMacOs = (): boolean => Boolean(userAgent.match(/Macintosh/i));
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera|OPR\//i));
  const isEdge = (): boolean => Boolean(userAgent.match(/Edg/i));
  const isWindowsMobile = (): boolean => Boolean(userAgent.match(/IEMobile/i));
  const isSSR = (): boolean => Boolean(userAgent.match(/SSR/i));
  const isSafari = (): boolean => Boolean(userAgent.match(/^((?!chrome|android).)*safari/i));
  const isChromium = (): boolean => {
    const anyWindow = window as any;
    return !!anyWindow.chrome;
  };
  const isChrome = (): boolean => Boolean(isChromium() && !isEdge() && !isOpera());

  const isMobile = (): boolean =>
    Boolean(isAndroid() || isIos() || isOpera() || isWindowsMobile());
  const isDesktop = (): boolean => Boolean(!isMobile() && !isSSR());
  return {
    isMobile: isMobile(),
    isDesktop: isDesktop(),
    isAndroid: isAndroid(),
    isMacOs: isMacOs(),
    isIos: isIos(),
    isSSR: isSSR(),
    isChromium: isChromium(),
    isChrome: Boolean(isChromium() && !isEdge() && !isOpera()),
    isSafari: isSafari(),
  };
};
