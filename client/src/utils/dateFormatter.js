export default function dateFormatter(dateString) {
    let date = new Date (dateString);

    return date.toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric"});
}