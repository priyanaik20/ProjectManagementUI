import Back from "./Back";

function PageTitle(props) {
  const { title, onBack } = props;

  return (
    <div className="page-header">
      <Back onBack={onBack} />
      <h1>{title}</h1>
    </div>
  );
}

export default PageTitle;
