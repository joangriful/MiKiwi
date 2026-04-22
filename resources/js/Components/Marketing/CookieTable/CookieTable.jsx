import React from 'react';
import styles from './CookieTable.module.css';

export default function CookieTable({ rows }) {
    return (
        <div className={styles.tableWrapper}>
            <table className={styles.table}>
                <thead>
                    <tr>
                        <th>Cookie</th>
                        <th>Tipo</th>
                        <th>Finalidad</th>
                        <th>Duración</th>
                    </tr>
                </thead>
                <tbody>
                    {rows.map((row) => (
                        <tr key={row.name}>
                            <td className={styles.cookieName}>{row.name}</td>
                            <td>{row.type}</td>
                            <td>{row.purpose}</td>
                            <td>{row.duration}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
