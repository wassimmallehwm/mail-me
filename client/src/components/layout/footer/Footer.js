import React, { useState } from 'react'
import { Dropdown } from 'semantic-ui-react'
import { currentLang } from '../../../utils/translate';
import './footer.css'

const Footer = ({changeLanguage}) => {
    const [language, setLanguage] = useState(currentLang());
    const handleClick = (e, { value }) => {
        setLanguage(value);
        changeLanguage(value)
    };

    const languages = [
        {
            label: 'English',
            value: 'en',
        },
        {
            label: 'Francais',
            value: 'fr',
        },
        {
            label: 'عربية',
            value: 'ar',
        }
    ]
    const langButton = (
        <Dropdown icon={null} text={language.toString().toUpperCase()} value={language}>
            <Dropdown.Menu>
                {languages.map(lang => (
                    <Dropdown.Item
                        key={lang.value}
                        value={lang.value}
                        text={lang.label.toString().toUpperCase()}
                        onClick={handleClick}
                    />
                ))}
            </Dropdown.Menu>
        </Dropdown>
    )

    return (
        <footer id="footer">
            <div className="footer-content">
                {langButton}
                <p> Mail-Me </p>
            </div>
        </footer>
    )
}

export default Footer
