import i18next from 'i18next';

export const trans = (key) => {
    return i18next.exists(key) ? i18next.t(key) : key;
}

export const currentLang = () => {
    return i18next.language;
}
