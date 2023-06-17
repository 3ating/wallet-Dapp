import { useContext } from 'react';
import { ThemeContext } from '../contexts/ThemeContext';
import { Switch } from 'antd';

const ThemeSwitch = () => {
    const { theme, toggleTheme } = useContext(ThemeContext);
    const isDark = theme === 'dark';

    return (
        <div>
            <Switch checked={isDark} onChange={toggleTheme} checkedChildren='Dark' unCheckedChildren='Light' />
        </div>
    );
};

export default ThemeSwitch;
