const theme = {
    text: {
        primary: '#212529',
        secondary: 'black',
        disabled: 'white',
    },
    background: {
        default: 'rgb(224,224,224,1)',
    },
    context: {
        background: '#E91E63',
        text: 'black',
    },
    divider: {
        default: 'rgba(81, 81, 81, 0)',
    },
    button: {
        default: '#FFFFFF',
        focus: 'rgb(255, 255, 255)',
        hover: 'rgb(255, 255, 255)',
        disabled: 'rgb(255, 255, 255)',
    },
    sortFocus: {
        default: 'black',
    },
    selected: {
        default: 'rgba(0, 0, 0, .7)',
        text: 'black',
    },
    highlightOnHover: {
        default: 'rgba(0, 0, 0, .7)',
        text: 'black',
    },
    striped: {
        default: 'rgba(200,200,200,1)',
        text: 'black',
    },
}



const dataTableTheme = {
    table: {
      style: {
        color: theme.text.primary,
        backgroundColor: theme.background.default,
      },
    },
    tableWrapper: {
      style: {
        display: 'table',
      },
    },
    header: {
      style: {
        fontSize: '22px',
        color: theme.text.primary,
        backgroundColor: theme.background.default,
        minHeight: '56px',
        paddingLeft: '16px',
        paddingRight: '8px',
      },
    },
    subHeader: {
      style: {
        backgroundColor: theme.background.default,
        minHeight: '52px',
      },
    },
    head: {
      style: {},
    },
    headRow: {
      style: {
        backgroundColor: theme.background.default,
        fontFamily:'Source Sans Pro',
        minHeight: '40px',
        borderBottomWidth: '1px',
        borderBottomColor: theme.divider.default,
        borderBottomStyle: 'solid',
      },
      denseStyle: {
        minHeight: '32px',
      },
    },
    headCells: {
      style: {
        backgroundColor:'#111111',
        fontSize: '1rem',
        fontWeight:'bolder',
        color: 'white',
        paddingLeft: '1px',
        paddingRight: '1px',
      },
      activeSortStyle: {
        color: 'white',
        '&:focus': {
          outline: 'none',
        },
        '&:hover:not(:focus)': {
          color: 'white',
        },
      },
      inactiveSortStyle: {
        '&:focus': {
          outline: 'none',
          color: 'white10',
        },
        '&:hover': {
          color: 'white',
        },
      },
    },
    contextMenu: {
      style: {
        backgroundColor: theme.context.background,
        fontSize: '18px',
        fontWeight: 400,
        color: theme.context.text,
        paddingLeft: '16px',
        paddingRight: '8px',
        transform: 'translate3d(0, -100%, 0)',
        transitionDuration: '125ms',
        transitionTimingFunction: 'cubic-bezier(0, 0, 0.2, 1)',
        willChange: 'transform',
      },
      activeStyle: {
        transform: 'translate3d(0, 0, 0)',
      },
    },
    cells: {
      style: {
        margin:'8px',
        paddingLeft: '16px',
        paddingRight: '16px',
        wordBreak: 'break-all',
      },
    },
    rows: {
      style: {
        fontSize: '16px',
        fontFamily: 'Bahnschrift',
        color: theme.text.primary,
        backgroundColor: theme.background.default,
        minHeight: '48px',
        '&:not(:last-of-type)': {
          borderBottomStyle: 'solid',
          borderBottomWidth: '1px',
          borderBottomColor: theme.divider.default,
        },
      },
      denseStyle: {
        minHeight: '32px',
      },
      selectedHighlightStyle: {
        // use nth-of-type(n) to override other nth selectors
        '&:nth-of-type(n)': {
          color: theme.selected.text,
          backgroundColor: theme.selected.default,
          borderBottomColor: theme.background.default,
        },
      },
      highlightOnHoverStyle: {
        color: theme.highlightOnHover.text,
        backgroundColor: theme.highlightOnHover.default,
        transitionDuration: '0.15s',
        transitionProperty: 'background-color',
        borderBottomColor: theme.background.default,
        outlineStyle: 'solid',
        outlineWidth: '1px',
        outlineColor: theme.background.default,
      },
      stripedStyle: {
        color: theme.striped.text,
        backgroundColor: theme.striped.default,
      },
    },
    expanderRow: {
      style: {
        color: theme.text.primary,
        backgroundColor: theme.background.default,
      },
    },
    expanderCell: {
      style: {
        flex: '0 0 48px',
      },
    },
    expanderButton: {
      style: {
        color: theme.button.default,
        fill: theme.button.default,
        backgroundColor: 'transparent',
        borderRadius: '2px',
        transition: '0.25s',
        height: '100%',
        width: '100%',
        '&:hover:enabled': {
          cursor: 'pointer',
        },
        '&:disabled': {
          color: theme.button.disabled,
        },
        '&:hover:not(:disabled)': {
          cursor: 'pointer',
          backgroundColor: theme.button.hover,
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: theme.button.focus,
        },
        svg: {
          margin: 'auto',
        },
      },
    },
    pagination: {
      style: {
        color: theme.text.secondary,
        fontSize: '13px',
        minHeight: '56px',
        backgroundColor: theme.background.default,
        borderTopStyle: 'solid',
        borderTopWidth: '1px',
        borderTopColor: theme.divider.default,
      },
      pageButtonsStyle: {
        borderRadius: '50%',
        height: '40px',
        width: '40px',
        padding: '8px',
        margin: 'px',
        cursor: 'pointer',
        transition: '0.4s',
        color: theme.button.default,
        fill: theme.button.default,
        backgroundColor: 'transparent',
        '&:disabled': {
          cursor: 'unset',
          color: theme.button.disabled,
          fill: theme.button.disabled,
        },
        '&:hover:not(:disabled)': {
          backgroundColor: theme.button.hover,
        },
        '&:focus': {
          outline: 'none',
          backgroundColor: theme.button.focus,
        },
      },
    },
    noData: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.text.primary,
        backgroundColor: theme.background.default,
      },
    },
    progress: {
      style: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: theme.text.primary,
        backgroundColor: theme.background.default,
      },
    },
  }
export default dataTableTheme;