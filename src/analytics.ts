import ReactGA from 'react-ga4';
// console.log("Analytics loaded");

export const initGA = () => {

    ReactGA.default.initialize('G-X2Q5JXX87Z');
};

export const logPageView = (page: string) => {
    ReactGA.default.send({ hitType: 'pageview', page });
};

export const logEvent = (category: string, action: string, label?: string) => {
    ReactGA.default.event({ category, action, label });
};
