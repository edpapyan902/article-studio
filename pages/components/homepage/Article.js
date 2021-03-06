/**
 * @param {{data: {user: string, name: string, content: string, display_img: string, description: string, views: number, tag: string, votes: number}}}
 */

export default ({ data }) => (
    <div className="created">
        {/*Article name and tag*/}
        <div id={data.name} style={{ 
            display: 'flex', flexDirection: 'column', justifyContent: 'center', 
            overflow: 'hidden', maxHeight: '480.63px' 
        }} className={data.tag + " " + data.user + " " + data.votes + " " + data.views}>
            {/*Display image*/}
            <img src={
                data.display_img && data.display_img !== "undefined" && data.display_img !== "Display image url" ? 
                    data.display_img : "images/image-icon.jpg"
                } height="150px" width="276px" />
            {/*Article name*/}
            <h3>{data.name.length <= 21 ? data.name : data.name.slice(0, 21) + "..."}</h3>
            {/*Article description*/}
            <div style={{
                 maxWidth: '250px', 
                 textAlign: data.description.length <= 110 ? "justify" : "left", 
                 fontSize: '13px' 
            }} className="article-content">
                {
                    data.description && data.description !== "undefined" ? 
                        (data.description.length <= 70 ? 
                            data.description : data.description.slice(0, 67) + "...") :
                            "Lorem ipsum dolor sit amet, consectetur adipiscing \
                            elit, sed do eiusmod..."
                }
            </div>
        </div>
    </div>
);

// Empty
export const getServerSideProps = () => ({});