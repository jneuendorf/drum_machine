import React from 'react'

import Dropdown from './Dropdown'
import {defaultConnect, filledArray} from "../utils"


class Navbar extends React.Component {
    render() {
        console.log(this.props)
        const {actions, tab} = this.props

        const addMeasure = function(numberOfBeats, noteValue) {
            const notesByInstrument = {}
            // TODO: use drumkit of previous measure for convenience
            const drumkit = null
            const measure = {
                numberOfBeats,
                noteValue,
                drumkit,
                notes: notesByInstrument,
            }
            const instruments = tab[drumkit]
            for (const instrument in instruments) {
                notesByInstrument[instrument] = filledArray(
                    // 4/4 => 8, 6/8 => 12, 3/4 => 6
                    numberOfBeats * 2,
                    null
                )
            }
            return actions.addMeasure(measure)
        }
        return (
            <nav className="navbar is-transparent">
                <div className="navbar-brand">
                        {/* <a className="navbar-item" href="http://bulma.io">
                            <img src="images/bulma-logo.png" alt="Bulma: a modern CSS framework based on Flexbox" width="112" height="28"/>
                        </a> */}
                    <div className="navbar-item">
                        DrumMachine
                    </div>
                </div>

                <div className="navbar-menu">
                    <div className="navbar-start">
                        <Dropdown label="Tab" items={[
                            {
                                label: "Add measure 4/4",
                                onClick: () => addMeasure(4, 4),
                            },
                            {
                                label: "Add measure x/y",
                            },
                            "divider",
                            {
                                label: "Pick a drumset",
                                onClick: () => {
                                    if (drumkit.isLoaded) {

                                    }
                                    else {
                                        actions.loadDrumkit(drumkit)
                                    }
                                    // TODO: show modal which sets instruments on click
                                    // const drumkit = new Howl({
                                    //     src: ['path1'],
                                    //     onload: () => {},
                                    // })
                                }
                            },
                            "divider",
                            {label: "Export"},
                            {label: "Import"},
                        ]} />
                        <Dropdown label="Docs" items={[
                            {
                                label: "Overview",
                                href: "docs.html",
                            },
                            {
                                label: "API",
                                href: "docs.html#api",
                            }
                        ]} />
                    </div>
                    <div className="navbar-end">
                        <div className="navbar-item">
                            <div className="field is-grouped">
                                <p className="control">
                                    <a className="button" href="#">
                                        <span className="icon">
                                            <i className="fa fa-cloud-download" />
                                        </span>
                                        <span>Import</span>
                                    </a>
                                </p>
                                <p className="control">
                                    <a className="button is-primary" href="#">
                                        <span className="icon">
                                            <i className="fa fa-cloud-upload" />
                                        </span>
                                        <span>Export</span>
                                    </a>
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        )
    }
}

Navbar = defaultConnect(Navbar)

export {Navbar}
export default Navbar


/*
<div className="navbar-start">
    <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link  is-active" href="/documentation/overview/start/">
            Docs
        </a>
        <div className="navbar-dropdown is-boxed">
            <a className="navbar-item" href="/documentation/overview/start/">
                Overview
            </a>
            <a className="navbar-item" href="http://bulma.io/documentation/modifiers/syntax/">
                Modifiers
            </a>
            <a className="navbar-item" href="http://bulma.io/documentation/columns/basics/">
                Columns
            </a>
            <a className="navbar-item" href="http://bulma.io/documentation/layout/container/">
                Layout
            </a>
            <a className="navbar-item" href="http://bulma.io/documentation/form/general/">
                Form
            </a>
            <a className="navbar-item" href="http://bulma.io/documentation/elements/box/">
                Elements
            </a>

            <a className="navbar-item is-active" href="http://bulma.io/documentation/components/breadcrumb/">
                Components
            </a>

            <hr className="navbar-divider"/>
            <div className="navbar-item">
                <div>
                    <p className="is-size-6-desktop">
                        <strong className="has-text-info">0.5.2</strong>
                    </p>

                    <small>
                        <a className="bd-view-all-versions" href="/versions">View all versions</a>
                    </small>

                </div>
            </div>
        </div>
    </div>
    <div className="navbar-item has-dropdown is-hoverable">
        <a className="navbar-link " href="http://bulma.io/blog/">
            Blog
        </a>
        <div id="blogDropdown" className="navbar-dropdown is-boxed" data-style="width: 18rem;">

            <a className="navbar-item" href="/2017/08/03/list-of-tags/">
                <div className="navbar-content">
                    <p>
                        <small className="has-text-info">03 Aug 2017</small>
                    </p>
                    <p>New feature: list of tags</p>
                </div>
            </a>

            <a className="navbar-item" href="/2017/08/01/bulma-bootstrap-comparison/">
                <div className="navbar-content">
                    <p>
                        <small className="has-text-info">01 Aug 2017</small>
                    </p>
                    <p>Bulma / Bootstrap comparison</p>
                </div>
            </a>

            <a className="navbar-item" href="/2017/07/24/access-previous-bulma-versions/">
                <div className="navbar-content">
                    <p>
                        <small className="has-text-info">24 Jul 2017</small>
                    </p>
                    <p>Access previous Bulma versions</p>
                </div>
            </a>

            <a className="navbar-item" href="http://bulma.io/blog/">
                More posts
            </a>
            <hr className="navbar-divider"/>
            <div className="navbar-item">
                <div className="navbar-content">
                    <div className="level is-mobile">
                        <div className="level-left">
                            <div className="level-item">
                                <strong>Stay up to date!</strong>
                            </div>
                        </div>
                        <div className="level-right">
                            <div className="level-item">
                                <a className="button bd-is-rss is-small" href="http://bulma.io/atom.xml">
                                    <span className="icon is-small">
                                        <i className="fa fa-rss" />
                                    </span>
                                    <span>Subscribe</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div className="navbar-item has-dropdown is-hoverable">
        <div className="navbar-link">
            More
        </div>
        <div id="moreDropdown" className="navbar-dropdown is-boxed">
            <a className="navbar-item" href="http://bulma.io/extensions/">
                <div className="level is-mobile">
                    <div className="level-left">
                        <div className="level-item">
                            <p>
                                <strong>Extensions</strong>
                                <br/>
                                <small>Side projects to enhance Bulma</small>
                            </p>
                        </div>
                    </div>
                    <div className="level-right">
                        <div className="level-item">
                            <span className="icon has-text-info">
                                <i className="fa fa-plug" />
                            </span>
                        </div>
                    </div>
                </div>
            </a>
        </div>
    </div>
</div>

<div className="navbar-end">
    <a className="navbar-item is-hidden-desktop-only" href="https://github.com/jgthms/bulma" target="_blank">
        <span className="icon" style={style.github}>
            <i className="fa fa-lg fa-github" />
        </span>
    </a>
    <a className="navbar-item is-hidden-desktop-only" href="https://twitter.com/jgthms" target="_blank">
        <span className="icon" style={style.twitter}>
            <i className="fa fa-lg fa-twitter" />
        </span>
    </a>
    <div className="navbar-item">
        <div className="field is-grouped">
            <p className="control">
                <a className="bd-tw-button button" data-social-network="Twitter" data-social-action="tweet" data-social-target="http://bulma.io" target="_blank" href="https://twitter.com/intent/tweet?text=Bulma: a modern CSS framework based on Flexbox&hashtags=bulmaio&url=http://bulma.io&via=jgthms">
                    <span className="icon">
                        <i className="fa fa-twitter" />
                    </span>
                    <span>
                        Tweet
                    </span>
                </a>

            </p>
            <p className="control">
                <a className="button is-primary" href="https://github.com/jgthms/bulma/archive/0.5.2.zip">
                    <span className="icon">
                        <i className="fa fa-download" />
                    </span>
                    <span>Download</span>
                </a>
            </p>
        </div>
    </div>
</div>
*/
