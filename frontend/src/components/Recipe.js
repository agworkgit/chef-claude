import '../style/list.css';
import ReactMarkdown from 'react-markdown';

export const Recipe = ({ recipe }) => {
    if (!recipe) return null; // show nothing if no recipe yet

    return (
        <section className='recipe-container'>
            <h2>Chef Claude Recommends:</h2>
            <article className='suggested-recipe-container' aria-live='polite'>
                <ReactMarkdown>{recipe}</ReactMarkdown>
            </article>
        </section>
    );
};
