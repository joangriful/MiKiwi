import Profile from '../Profile/Profile';
import styles from './OrderShow.module.css';

export default function OrderShow(props) {
    return (
        <div className={styles.root}>
            <Profile {...props} initialTab="orders" />
        </div>
    );
}
