import PsvSheet from './calcs/psv-api'
function Content({navIndex}){
    switch (navIndex) {
        case 0:
            return <PsvSheet />
    
        default:

            return <div>12</div>
    }

}
export default Content