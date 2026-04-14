function Locations() {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '90dvh',
            width: '100dvw'
        }}>
            <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                width: '100%',
                height: '100%'
            }}>
                <iframe
                    style={{
                        width: '95%',
                        height: '95%',
                        border: '0',
                    }}
                    allowFullScreen allow="geolocation" src="//umap.openstreetmap.fr/en/map/app200v-blueberry-hotels_1390929?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true"></iframe><p><a href="//umap.openstreetmap.fr/en/map/app200v-blueberry-hotels_1390929?scaleControl=false&miniMap=false&scrollWheelZoom=true&zoomControl=true&editMode=disabled&moreControl=true&searchControl=null&tilelayersControl=null&embedControl=null&datalayersControl=true&onLoadPanel=none&captionBar=false&captionMenus=true">
                        {/* See full screen */}
                    </a></p>
            </div>
        </div>
    )
}

export default Locations;