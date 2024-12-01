import ReactGA from 'react-ga4'

export const initGA = () => {
    ReactGA.initialize("G-X2Q5JXX87Z"); // TODO: remove hardcode tag
};

export const trackPageView = (page: string) => {
    ReactGA.send({ hitType: "pageview", page });
};

export const trackEvent = (category: string, action: string, label?: string) => {
    ReactGA.event({ category, action, label });
};
