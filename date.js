module.exports.getDate = getDate;

    function getDate(){

            const date = new Date();

            const options = {
                weekday:'long',
                month:"long",
                day:"numeric"
            };

            const result = date.toLocaleDateString("en-US", options);

            return result;
    }



exports.getDay = getDay;
    function getDay(){

        const date = new Date();

        const options = {
            weekday:'long',
        };

        const result = date.toLocaleDateString("en-US", options);

        return result;
    }