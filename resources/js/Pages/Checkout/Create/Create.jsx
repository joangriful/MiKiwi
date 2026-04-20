import Cart from '../Cart/Cart';
import styles from './Create.module.css';

export default function Create(props) {
    return (
        <div className={styles.root}>
            <Cart {...props} />
        </div>
    );
}
