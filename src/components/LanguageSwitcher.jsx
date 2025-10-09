import React from 'react';
import { Dropdown } from 'react-bootstrap';
import { useLanguage } from '../contexts/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage, t } = useLanguage();

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
  };

  return (
    <Dropdown className="language-switcher">
      <Dropdown.Toggle variant="outline-secondary" size="sm" id="language-dropdown">
{language === 'en' ? 'English' : '中文'}
      </Dropdown.Toggle>
      <Dropdown.Menu>
        <Dropdown.Item 
          onClick={() => handleLanguageChange('en')}
          active={language === 'en'}
        >
English
        </Dropdown.Item>
        <Dropdown.Item 
          onClick={() => handleLanguageChange('zh')}
          active={language === 'zh'}
        >
中文
        </Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );
};

export default LanguageSwitcher;
