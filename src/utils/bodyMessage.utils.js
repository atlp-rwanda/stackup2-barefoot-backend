/* eslint-disable require-jsdoc */
const emailBody = (name, intro, instructions, color, text, link, outro) => {
    const body = {
        body: {
            name,
            intro,
            action: {
                instructions,
                button: {
                    color,
                    text,
                    link
                }
            },
            outro
        }
    };
    return body;
};

export default emailBody;
