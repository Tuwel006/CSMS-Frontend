// File: src/components/ScoreEditor/BatsmanList.tsx
import { useScore } from "@/context";

const BatsmanList = () => {
  const { batsmen } = useScore();

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm text-left">
        <thead className="text-gray-500 dark:text-gray-300">
          <tr>
            <th>Name</th>
            <th>R</th>
            <th>B</th>
            <th>SR</th>
          </tr>
        </thead>
        <tbody>
          {batsmen.map((batsman, i) => (
            <tr key={i} className="border-t dark:border-gray-600">
              <td>
                {batsman.striker && <span>*</span>} {batsman.name}
              </td>
              <td>{batsman.runs}</td>
              <td>{batsman.balls}</td>
              <td>{((batsman.runs / batsman.balls) * 100).toFixed(1)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BatsmanList;