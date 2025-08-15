import OverOptionsAccordion from "../components/ui/ScoreEditorComponets/OverActionAccordion";

const Dashboard = () => {
  return (
    <div>
      <h2 className="text-2xl font-semibold mb-4">Dashboard</h2>
      <p>Welcome to your personalized cricket dashboard!</p>
      <div>
        <OverOptionsAccordion />
      </div>
    </div>
  );
};

export default Dashboard;
