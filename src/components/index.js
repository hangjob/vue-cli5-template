const componentsContext = require.context('./', true, /\.vue$/)

const setupComps = (app) => {
    componentsContext.keys().forEach(fileName => {
        const reqCom = componentsContext(fileName)
        const reqComName = reqCom.name || fileName.replace(/\.\/(.*)\.vue$/, '$1')
        const name = reqComName.replace(/([A-Z])/g, "-$1").toLowerCase();
        app.component(`pm-${name.substring(1, name.length)}`, reqCom.default || reqCom)
    })
}

export default setupComps;
