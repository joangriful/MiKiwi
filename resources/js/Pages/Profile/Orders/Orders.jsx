import Profile from '../Profile/Profile';
import styles from './Orders.module.css';

export default function Orders(props) {
    return (
        <div className={styles.root}>
            <Profile {...props} initialTab="orders" />
        </div>
    );
}
