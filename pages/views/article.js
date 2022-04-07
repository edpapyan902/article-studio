// @ts-check
import Head from "../components/headers/article";
import Article from "../components/homepage/Article";

/**
 * @param {
    {
        Csession: import("express-session").Session & Partial<import("express-session").SessionData>, 
        headerName: string, 
        articles: string
    }
} props
 */

export default ({ Csession, headerName: originalHeaderName, articles: originalArticles }) => {
    /**
     * @type {{user: string, name: string, content: string, display_img: string, description: string, views: number, tag: string, votes: number}[]}
     */
    const articles = JSON.parse(originalArticles);
    const headerName = originalHeaderName;

    return (
        <>
            <Head />
            <div className="wait">
                <div id="hover-action"></div>
                {/*Search bar*/}
                <div className="search-bar">
                    <input type="text" placeholder="Search article name, tag, views, votes or author" />
                </div>
                {/*Navbar*/}
                <nav id="nav">
                    {/*Navbar buttons*/}
                    <div style={{ display: 'flex' }} id="nav_button">
                        <div className="create" id="new">NEW</div>
                        <div className="create" id="sign">SIGN UP</div>
                        <div className="create" id="login">LOGIN</div>
                    </div>
                    {/*Navbar search icon*/}
                    <div className="input">
                        <button
                            style={{
                                margin: '0px', backgroundColor: 'transparent !important', borderColor: 'transparent',
                                borderStyle: 'solid', borderWidth: '5px', height: '36px'
                            }}>
                            <i className="fa fa-search" style={{
                                backgroundColor: 'transparent', color: 'white', fontSize: '16px'
                            }}></i>
                        </button>
                    </div>
                </nav>
                {/*Make the background darker*/}
                <div id="inner"></div>
                {/*Banner text*/}
                <div id="banner-text">
                    <h1>Article Studio</h1>
                    <h6>A place for creating creative articles</h6>
                </div>
                <div className="banner"></div>
            </div>
            {/*Data*/}
            <span style={{ display: 'none' }}>{Csession}</span>
            <span style={{ display: 'none' }}>{headerName}</span>
            <script type="text/javascript" src="/javascripts/getData.js"></script>
            <script src="/javascripts/homepage/main.js"></script>
            {/*Article collections links*/}
            <div id="sort">
                <div className="list" id="/article">Discover</div>
                <div className="list" id="/mostvote">Most Voted</div>
                {Csession ? <>
                    <div className='list' id="/myarticle">My Articles</div>
                    <div className='list' id="/otherarticle">Other Articles</div>
                    <div className='list' id="/collaborated">Collaborated Articles</div>
                </> : <></>}
                <script src="/javascripts/homepage/collections.js"></script>
            </div>
            {/*Header*/}
            <h2 style={{ fontFamily: 'Oxygen' }} id="header-name">{headerName}</h2>
            <hr style={{ width: '10%' }} />
            {/*Created article*/}
            <div id='created-article'>
                {articles.map(d => <Article data={d} key={d.name} />)}
            </div>
            {/*Scripts*/}
            <script src="/javascripts/homepage/navbuttons.js"></script>
            <script src="/javascripts/homepage/endscript.js"></script>
        </>
    );
};

export const getServerSideProps = async context => ({
    props: {
        Csession: context.query.Csession?.userID ?? null,
        headerName: context.query.headerName,
        articles: JSON.stringify(context.query.articles)
    }
});