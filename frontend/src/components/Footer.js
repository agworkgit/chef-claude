import '../style/footer.css';

export const Footer = () => {
    const currentYear = new Date().getFullYear();
    return (
        <footer>
            <small>&copy; Casian Grigore {currentYear}</small>
        </footer>
    );
};