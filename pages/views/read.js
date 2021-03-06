import Head from "../components/headers/read";

const detailStyle = {
    fontSize: '12px !important',
    alignSelf: 'flex-end'
}

/**
 * @param {{name: string, admin_button: string, content: string, views: number, author: string, tag: string, votes: number, coAuthor: string[]}}
 */
export default ({ name, content, views, author, tag, votes, user, coAuthor }) => (
    <>
        <Head name={name} />
        {/*Data*/}
        <span>{name}</span>
        <span>{content}</span>
        <span>{user}</span>
        {/*Navbar*/}
        <div id="buttons">
            <button id="back">Back</button><br />
            <button id="discuss_redirect">Discuss</button><br />
            <label htmlFor="theme-changer">Theme</label>
            <select id="theme-changer">
                <option id="base16/ocean">Default</option>
                <option id="vs2015">VS Dark</option>
                <option id="vs">VS Light</option>
                <option id="github">Github</option>
                <option id="idea">ItelliJ IDEA</option>
                <option id="androidstudio">Android Studio</option>
                <option id="atom-one-dark">Atom Dark</option>
                <option id="atom-one-light">Atom Light</option>
                <option id="stackoverflow-dark">Stackoverflow Dark</option>
                <option id="stackoverflow-light">Stackoverflow Light</option>
                <option id="xcode">XCode</option>
            </select>
            <button style={
                {display: user === author || coAuthor.indexOf(user) > -1 ? 'block' : 'none'}
            } id="edit">Edit</button>
            <button style={
                {display: user === author || coAuthor.indexOf(user) > -1 ? 'block' : 'none'}
            } id="del">Delete</button>
            <button id="vote" style={
                {display: user === author || coAuthor.indexOf(user) > -1 ? 'none' : 'block'}
            }>Vote</button>
        </div>
        {/*Content and article data*/}
        <div
            style={{
                display: 'flex', flexDirection: 'column', justifyContent: 'center',
                alignItems: 'left', padding: '20px', borderLeft: '2px solid #222',
                borderRight: '2px solid #222', marginTop: '30px'
            }}>
            {/*Article*/}
            <div id="content"></div>
            {/*Article data*/}
            <div style={detailStyle} id="viewsDetail"> Views: {views} </div>
            <div style={detailStyle} id="authorDetail">Author: {author}</div>
            <div style={detailStyle} id="tagDetail">Tag: {tag}</div>
            <div style={detailStyle} id="votesDetail">Votes: {votes}</div>
        </div>
        <script type="text/javascript" src="/javascripts/getData.js"></script>
        <script src="/javascripts/content/read.js"></script>
    </>
);

export const getServerSideProps = async (context) => ({
    props: {
        name: context.query.name,
        content: context.query.content,
        views: context.query.views,
        author: context.query.author,
        tag: context.query.tag,
        votes: context.query.votes,
        user: context.query.user,
        coAuthor: context.query.coAuthor
    }
});