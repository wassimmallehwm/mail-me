const displayName = (user) => {
    if (user.firstname && user.firstname != '' && user.lastname && user.lastname != '') {
        return user.firstname + ' ' + user.lastname;
    }
    return user.username;
}

export default displayName;