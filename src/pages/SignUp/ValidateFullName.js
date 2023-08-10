function ValidateFullName(fullName) {

    const errors = []
    if (!fullName) {
        errors.push( 'Full Name is required');
      } else if (fullName.length < 5 || fullName.length > 50) {
        errors.push('Full Name Must Be Between 5:50 character');
      }
      if (errors.length === 0) {
        return true;
      } else {
        return false;
      }
}
export default ValidateFullName;