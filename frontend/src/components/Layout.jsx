import TopBar from './TopBar';

const Layout = ({ children }) => {
    return (
        <>
            <TopBar />
            <main className="page-content">
                {children}
            </main>
        </>
    );
};

export default Layout;
