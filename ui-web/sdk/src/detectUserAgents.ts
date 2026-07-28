export interface UserAgents {
  isAndroid: boolean;
  isMacOs: boolean;
  isIos: boolean;
  isChrome: boolean;
  isSafari: boolean;
  supportsDigitalCredentialsApi: boolean;
}
export const detectUserAgents = (): UserAgents => {
  const userAgent = navigator.userAgent;
  const isAndroid = (): boolean => Boolean(userAgent.match(/Android/i));
  const isMacOs = (): boolean => Boolean(userAgent.match(/Macintosh/i));
  const isIos = (): boolean => Boolean(userAgent.match(/iPhone|iPad|iPod/i));
  const isOpera = (): boolean => Boolean(userAgent.match(/Opera|OPR\//i));
  const isEdge = (): boolean => Boolean(userAgent.match(/Edg/i));
  const isSafari = (): boolean => Boolean(userAgent.match(/^((?!chrome|android).)*safari/i));
  const isChromium = (): boolean => {
    const anyWindow = window as any;
    return !!anyWindow.chrome;
  };
  const isChrome = (): boolean => Boolean(isChromium() && !isEdge() && !isOpera());
  const supportsDigitalCredentialsApi = (): boolean => !!navigator.credentials && !!navigator.credentials.get && typeof (window as any).DigitalCredential !== "undefined";

  return {
    isAndroid: isAndroid(),
    isMacOs: isMacOs(),
    isIos: isIos(),
    isChrome: Boolean(isChromium() && !isEdge() && !isOpera()),
    isSafari: isSafari(),
    supportsDigitalCredentialsApi: supportsDigitalCredentialsApi()
  };
};
