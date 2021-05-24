# safeAction

<b>This action provides the following functionality for GitHub Actions runners:</b>
<ul>
  <li>Gets list of actions from Gtihub repositury workflow</li>
  <li>Gets list of allowed actions for checking the workflow</li>
  <li>Checking unallowed actions in the list from workflow</li>
  <li>If safeAction has founded unallowed action, stops the PipeLine</li>
  <li>If evrything is OK, shows successful message in logs</li>
</ul>
<hr />
<b>Example:</b>
For using safeAction you need to import it to workflow before all actions: <br />
    <textarea>- name: Checking actions
        uses: 1-PF/safeAction@v21
    </textarea>
