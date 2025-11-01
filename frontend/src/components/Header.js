import chef from '../assets/chef.png';
import '../style/header.css';

export const Header = () => {
    return (
        <header>
            <img src={chef} alt="chef" />
            <h1>Chef Claude</h1>
        </header>
    );
};