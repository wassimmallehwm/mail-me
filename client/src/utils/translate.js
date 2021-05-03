import i18next from 'i18next';

const trans = (key) => {
    return i18next.exists(key) ? i18next.t(key) : key;
}

export default trans;