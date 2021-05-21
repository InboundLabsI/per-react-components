import React from "react";


const useProductMenu = () => {
    const [menuItems, setMenuItems] = React.useState([])
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState(null);

    const getMenuItems = async () => {
        setLoading(true);
        const res = await fetch(`https://permobil-product-explorer-airtables-api.vercel.app/navigator-product-categories.php`);
        const data = await res.json();
        if (!!data) {
            setMenuItems(data);
            setError(null)
        } else {
            setError('No categories found')
            setMenuItems([]);
        }
        setLoading(false);
        return;
    }

    React.useEffect(() => {
        const doGetMenuItems = async () => {
            try {
                await getMenuItems();
            } catch (err) {
                setError('No categories found')
                setMenuItems([]);
            }
        }

        doGetMenuItems();

    }, [])

    return { menuItems, loading, error }
}

export default useProductMenu;