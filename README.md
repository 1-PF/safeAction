# safeAction

<b>This action provides the following functionality for GitHub Actions runners:</b>
<ul>
  <li>Gets list of used actions from GitHub repository workflow</li>
  <li>Checks if all of used actions were verified</li>
  <li>If safeAction has found an action that was not marked as SAFEACTION, stops the pipeline or print warning (depends on mode).</li>
  <li>If everything is OK, shows successful message in logs</li>
</ul>
<hr />
<b>Example:</b>
For using safeAction you need to import it to workflow before all actions: <br />
<pre>- name: Checking actions
  uses: 1-PF/safeAction@v1
    with:
      mode: 'SAFE' (default, other possible values are INFORMATION, IGNORE)
      authorization: YOUR_TOKEN_HERE (not required, but when token is not provided SafeAction results are limited)
</pre>
